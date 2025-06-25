"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// @ts-ignore
const parser_1 = __importDefault(require("@postlight/parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Parser endpoint (GET)
app.get('/parser', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({
                error: 'URL parameter is required'
            });
        }
        const result = await parser_1.default.parse(url);
        if (result) {
            res.json(result);
        }
        else {
            res.status(500).json({
                message: 'There was an error parsing that URL.'
            });
        }
    }
    catch (error) {
        console.error('Parser error:', error);
        res.status(500).json({
            message: 'There was an error parsing that URL.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Parse HTML endpoint (POST)
app.post('/parse-html', async (req, res) => {
    try {
        const { html, url } = req.body;
        if (!html || !url) {
            return res.status(400).json({
                error: 'HTML and URL are required in request body'
            });
        }
        const result = await parser_1.default.parse(url, { html });
        if (result) {
            res.json(result);
        }
        else {
            res.status(500).json({
                message: 'There was an error parsing that HTML.'
            });
        }
    }
    catch (error) {
        console.error('HTML parser error:', error);
        res.status(500).json({
            message: 'There was an error parsing that HTML.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Postlight Parser API',
        version: '2.2.3',
        endpoints: {
            'GET /parser': 'Parse a URL',
            'POST /parse-html': 'Parse HTML content',
            'GET /health': 'Health check'
        }
    });
});
// Start server
app.listen(port, () => {
    console.log(`Parser API server running on port ${port}`);
});
