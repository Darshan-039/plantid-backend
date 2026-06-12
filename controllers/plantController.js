const axios = require("axios");
const fs = require("fs");

const supabase = require("../config/supabase");



exports.identifyPlant = async (req, res) => {

    try {

        const imagePath = req.file.path;

        const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

        const response =
            await axios.post(
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
                        "Api-Key":
                            process.env.PLANT_API_KEY,
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        const suggestion = response.data.suggestions[0];

        const { data, error } =
            await supabase
                .from("plant_history")
                .insert([
                    {
                        plant_name:
                            suggestion.plant_name,

                        scientific_name:
                            suggestion.plant_details
                                .scientific_name,

                        confidence:
                            suggestion.probability,

                        common_name:
                            suggestion.plant_details
                                .common_names?.[0] || "",

                        family:
                            suggestion.plant_details
                                .taxonomy?.family || "",

                        genus:
                            suggestion.plant_details
                                .taxonomy?.genus || "",

                        description:
                            suggestion.plant_details
                                .wiki_description?.value || "",

                        image_url:
                            imagePath
                    }
                ])
                .select()
                .single();

        if (error) {
            console.log(error);
        }

        res.json({
            success: true,
            result: suggestion,
            history: data
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getHistory = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("plant_history")
            .select("*")
            .order(
                "scanned_at",
                { ascending: false }
            );

        if (error) return res.status(500).json(error);

        res.json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteHistory = async (req, res) => {

    try {

        const id = req.params.id;

        const { error } = await supabase
            .from("plant_history")
            .delete()
            .eq("id", id);
            

        if (error) return res.status(500).json(error);

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