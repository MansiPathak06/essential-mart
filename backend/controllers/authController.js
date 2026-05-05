const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: "Success",
        role: user.role, // "ADMIN" or "USER"
        name: user.name
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};