const axios = require("axios");
const fs = require("fs");

const supabase = require("../config/supabase");

exports.identifyPlant = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });
        }

        const imagePath = req.file.path;
        const userId = req.body.user_id;

        console.log("BODY:", req.body);
        console.log("USER ID:", req.body.user_id);

        const imageBase64 = fs.readFileSync(
            imagePath,
            { encoding: "base64" }
        );

        const response = await axios.post(
            "https://api.plant.id/v2/identify",
            {
                images: [imageBase64],
                plant_details: [
                    "common_names",
                    "wiki_description",
                    "taxonomy"
                ]
            },
            {
                headers: {
                    "Api-Key": process.env.PLANT_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        const suggestion = response.data.suggestions?.[0];

        if (!suggestion) {
            return res.status(400).json({
                success: false,
                message: "Plant could not be identified"
            });
        }

        const { data: history, error } = await supabase
            .from("plant_history")
            .insert([
                {
                    user_id: userId,

                    plant_name:
                        suggestion.plant_name || "",

                    scientific_name:
                        suggestion.plant_details?.scientific_name || "",

                    confidence:
                        suggestion.probability || 0,

                    common_name:
                        suggestion.plant_details?.common_names?.[0] || "",

                    family:
                        suggestion.plant_details?.taxonomy?.family || "",

                    genus:
                        suggestion.plant_details?.taxonomy?.genus || "",

                    description:
                        suggestion.plant_details?.wiki_description?.value || "",

                    image_url:
                        imagePath
                }
            ])
            .select()
            .single();

        if (error) {

            console.log("SUPABASE ERROR:");
            console.log(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        res.json({
            success: true,
            result: suggestion,
            history
        });

    } catch (error) {

        console.log("Identify Plant Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getHistory = async (req, res) => {

    try {

        const userId = req.query.user_id;

        const { data, error } = await supabase
            .from("plant_history")
            .select("*")
            .eq("user_id", userId)
            .order("id", { ascending: false });

        if (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        res.json(data);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.deleteHistory = async (req, res) => {

    try {

        const id = req.params.id;

        const { error } = await supabase
            .from("plant_history")
            .delete()
            .eq("id", id);

        if (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        res.json({
            success: true,
            message: "History deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};