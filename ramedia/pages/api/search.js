export default async function handler(req, res) {
    try {
        const title = req.body.search;
        console.log(title);
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}