const Review = require("../models/reviewModels"); // Path to your review model
const Property = require("../models/propertyModel"); // Path to your property model

// ✅ Ensure the review schema has `view: true` by default
exports.createview = async (req, res) => {
    const { property, reviewer } = req.body;

    try {
        // ✅ Check if the property exists
        const propertyExists = await Property.findById(property);
        if (!propertyExists) {
            return res.status(404).json({ message: "Property not found here" });
        }

        // ✅ Check if a view record already exists
        let review = await Review.findOne({ property, reviewer });

        if (!review) {
            // ✅ Create new view record if it doesn’t exist
            review = new Review({
                property,
                reviewer,
                view: true, // ✅ Ensure `view` defaults to true
            });
            await review.save();
        }

        res.status(201).json({
            message: "View recorded successfully",
            review,
        });
    } catch (error) {
        console.error("Error creating view:", error);
        res.status(500).json({ message: "Failed to record view", error: error.message });
    }
};

// ✅ Create or update review
exports.createReview = async (req, res) => {
    const { property, reviewer, rating, comment } = req.body;

    try {
        // ✅ Check if the property exists
        const propertyExists = await Property.findById(property);
        if (!propertyExists) {
            return res.status(404).json({ message: "Property not found" });
        }

        // ✅ Check if a review already exists for this property by the same reviewer
        let review = await Review.findOne({ property, reviewer });

        if (review) {
            // ✅ Update rating and comment if provided
            if (rating !== undefined) review.rating = rating;
            if (comment !== undefined) review.comment = comment;
            await review.save();

            return res.status(200).json({
                message: "Review updated successfully",
                review,
            });
        }

        // ✅ Create a new review if none exists
        review = new Review({
            property,
            reviewer,
            rating,
            comment,
            view: true, // ✅ Ensure `view` is set
        });

        const savedReview = await review.save();

        res.status(201).json({
            message: "Review added successfully",
            review: savedReview,
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
};

// ✅ Get all reviews for a property
exports.ratebyID = async (req, res) => {
    const { propertyID } = req.params;
    try {
        const reviews = await Review.find({ property: propertyID });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews available for this property.." });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
