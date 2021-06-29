const fs = require('fs');
const makerjs = require('makerjs');
const opentype = require('opentype.js');

const {
    foreground_layer_drawable_path,
    overlay_text,
    overlay_text_color,
    overlay_background_color,
} = process.env;

const fontPath = require.resolve('@fontsource/lato/files/lato-latin-700-normal.woff');
const font = opentype.loadSync(fontPath);
const textModel = new makerjs.models.Text(font, overlay_text, 18);
const svg = makerjs.exporter.toSVG(textModel, {
    useSvgPathOnly: true,
    accuracy: 0.1,
});
const matches = svg.match(/<path d="([^"]+)/);
if (!matches || !matches[1]) throw new Error('Path data not found in SVG');

const pathData = matches[1];
const overlay = `
    <path
        android:fillColor="${overlay_background_color}"
        android:pathData="M 0 66 L 108 66 L 108 108 L 0 108 Z"
    />
    <group android:translateX="22.0" android:translateY="70.0">
        <path
            android:fillColor="${overlay_text_color}"
            android:pathData="${pathData}"
        />
    </group>
`;

const xml = fs.readFileSync(foreground_layer_drawable_path, 'utf8');
const newXml = xml.replace('</vector>', overlay + '</vector>');
fs.writeFileSync(foreground_layer_drawable_path, newXml);
