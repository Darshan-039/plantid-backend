const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        const { data: existing } =
            await supabase
                .from("profiles")
                .select("*")
                .eq("email", email);

        if (existing.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const { data, error } =
            await supabase
                .from("profiles")
                .insert([
                    {
                        name,
                        email,
                        password: hashedPassword
                    }
                ])
                .select()
                .single();

        if (error) {

            return res.status(500).json(error);
        }

        res.json({
            success: true,
            user: data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, data.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        res.json({
            success: true,
            user: data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};