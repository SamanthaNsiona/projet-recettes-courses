const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// POST create a course
exports.createCourse = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;

    const newCourse = await prisma.course.create({
      data: { name, quantity, unit },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// PUT update
exports.updateCourse = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, quantity, unit } = req.body;

    const updated = await prisma.course.update({
      where: { id },
      data: { name, quantity, unit },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// DELETE
exports.deleteCourse = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.course.delete({ where: { id } });

    res.json({ message: "Course supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
