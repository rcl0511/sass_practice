router.get('/medicines', async (req, res) => {
    const { name } = req.query;
    const results = await Medicine.find(name ? { name: new RegExp(name, 'i') } : {});
    res.json(results);
  });
  