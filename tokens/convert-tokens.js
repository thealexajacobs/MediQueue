const fs = require('fs');

try {
    const colorTokens = JSON.parse(fs.readFileSync('./color-tokens.json', 'utf8'));
    const designTokens = JSON.parse(fs.readFileSync('./design-tokens.tokens.json', 'utf8'));

    let cssContent = `/* Generated CSS Variables */\n\n`;

    // Helper to resolve color references
    function resolveColorReference(ref, tokens) {
        if (typeof ref === 'string' && ref.startsWith('{') && ref.endsWith('}')) {
            const path = ref.slice(1, -1).split('.');
            let current = tokens;
            for (const key of path) {
                if (current[key] !== undefined) {
                    current = current[key];
                } else {
                    // Try case-insensitive match
                    const lowerKey = key.toLowerCase();
                    const matchedKey = Object.keys(current).find(k => k.toLowerCase() === lowerKey);
                    if (matchedKey) {
                        current = current[matchedKey];
                    } else if (!isNaN(Number(key))) {
                        // Fallback to closest numeric key
                        const numKey = Number(key);
                        const availableKeys = Object.keys(current).filter(k => !isNaN(Number(k))).map(Number);
                        if (availableKeys.length > 0) {
                            const closest = availableKeys.reduce((prev, curr) => 
                                Math.abs(curr - numKey) < Math.abs(prev - numKey) ? curr : prev
                            );
                            current = current[String(closest)];
                        } else {
                            console.warn(`Warning: Could not resolve numeric reference ${ref}`);
                            return ref;
                        }
                    } else {
                        console.warn(`Warning: Could not resolve reference ${ref}`);
                        return ref;
                    }
                }
            }
            return current;
        }
        return ref;
    }

    const colorRolesLight = colorTokens.color.role.light;
    const colorRolesDark = colorTokens.color.role.dark;

    cssContent += `:root {\n`;
    cssContent += `  /* Light Theme Colors */\n`;
    for (const [role, value] of Object.entries(colorRolesLight)) {
        const resolvedValue = resolveColorReference(value, colorTokens);
        const cssVarName = role.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        cssContent += `  --color-${cssVarName}: ${resolvedValue};\n`;
    }

    cssContent += `\n  /* Typography */\n`;
    const typography = designTokens.typography;
    if (typography) {
        for (const [category, properties] of Object.entries(typography)) {
            const categoryName = category.replace(/\s+/g, '-').toLowerCase();
            for (const [propName, propData] of Object.entries(properties)) {
                let value = propData.value;
                if (propData.type === 'dimension' && typeof value === 'number' && value !== 0) {
                    value = `${value}px`;
                } else if (propData.type === 'dimension' && value === 0) {
                    value = '0px';
                }
                const cssPropName = propName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
                cssContent += `  --typography-${categoryName}-${cssPropName}: ${value};\n`;
            }
        }
    } else {
        console.warn("Warning: Could not find 'typography' object in design-tokens.tokens.json");
    }
    cssContent += `}\n\n`;

    cssContent += `[data-theme="dark"], .dark {\n`;
    cssContent += `  /* Dark Theme Colors */\n`;
    for (const [role, value] of Object.entries(colorRolesDark)) {
        const resolvedValue = resolveColorReference(value, colorTokens);
        const cssVarName = role.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        cssContent += `  --color-${cssVarName}: ${resolvedValue};\n`;
    }
    cssContent += `}\n`;

    fs.writeFileSync('./variables.css', cssContent);
    console.log('Successfully generated variables.css');
} catch (error) {
    console.error('Error:', error.message);
}
