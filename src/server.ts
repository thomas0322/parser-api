import express, { Request, Response } from 'express';
import cors from 'cors';
// @ts-ignore
import Parser from '@postlight/parser';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Parser endpoint (GET)
app.get('/parser', async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ 
        error: 'URL parameter is required' 
      });
    }

    const result = await Parser.parse(url);
    
    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ 
        message: 'There was an error parsing that URL.' 
      });
    }
  } catch (error) {
    console.error('Parser error:', error);
    res.status(500).json({ 
      message: 'There was an error parsing that URL.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Parse HTML endpoint (POST)
app.post('/parse-html', async (req: Request, res: Response) => {
  try {
    const { html, url } = req.body;
    
    if (!html || !url) {
      return res.status(400).json({ 
        error: 'HTML and URL are required in request body' 
      });
    }

    const result = await Parser.parse(url, { html });
    
    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ 
        message: 'There was an error parsing that HTML.' 
      });
    }
  } catch (error) {
    console.error('HTML parser error:', error);
    res.status(500).json({ 
      message: 'There was an error parsing that HTML.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
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