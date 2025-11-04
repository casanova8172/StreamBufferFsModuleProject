const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Serve the form
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write(`
            <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="username" />
                <button type="submit">Add</button>
            </form>
        `);
        return res.end();
    }

    // Handle form submission
    if (url === '/message' && method === 'POST') {
        const body = [];

        // 'data' event: triggered when a chunk of data arrives
        req.on('data', (chunk) => {
            console.log(chunk)
            console.log(chunk.toString())
            body.push(chunk); // push chunks into array
        });

        // 'end' event: triggered when all data is received
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            // parsedBody looks like: "username=Leelanand"
            const message = parsedBody.split('=')[1];

            // Write the message to a file
            fs.writeFile('message.txt', message, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                }

                // Redirect to home page (status 302)
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
