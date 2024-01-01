export default async function getAddressByIndexer(req, res) {
    const { publicKey, apikey, network } = JSON.parse(req.body);
    const url = `https://key-indexer.production.flow.com/key/?${publicKey}`;
    const result = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: apikey,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    const json = await result.json();
    console.log("result ==>", json);
    res.status(200).json({ data });
  }
  