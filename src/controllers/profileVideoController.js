const db = require('../config/db');

exports.getUserVideos = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ message: "ID de usuario no proporcionado." });
    }

    const videoQuery = 'SELECT * FROM videos WHERE usuarioid = $1';
    const result = await db.query(videoQuery, [usuarioId]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No hay videos cargados" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log('Error fetching videos:', error.message);
    res.status(500).json({ message: "Error al obtener los videos." });
  }
};

exports.getVideoById = async (req, res) => {
    const videoId = req.params.id;
    try {
      const videoQuery = 'SELECT * FROM videos WHERE id = $1';
      const result = await db.query(videoQuery, [videoId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Video not found" });
      }
  
      const video = result.rows[0];
      res.status(200).json(video);
    } catch (error) {
      console.log('Error fetching video data:', error.message);
      res.status(500).json({ error: error.message });
    }
  };

  exports.getLoggedInUserVideos = async (req, res) => {
    try {
      const userId = req.user.id;  // Suponiendo que tienes el middleware que decodifica el token JWT
  
      const videoQuery = 'SELECT * FROM videos WHERE usuarioid = $1';
      const result = await db.query(videoQuery, [userId]);
  
      if (result.rows.length === 0) {
        return res.status(200).json({ message: "No hay videos cargados" });
      }
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.log('Error fetching videos:', error.message);
      res.status(500).json({ message: "Error al obtener los videos." });
    }
  };