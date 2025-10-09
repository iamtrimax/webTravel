import { useState } from "react"
import sumaryApi from "../common"
import { useEffect } from "react"

export const useReview = (tourId) => {
    const [reviews, setReviews] = useState([])
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState({
        averageRating: 0,
        totalRatings: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    })
    const fetchReviews = async () => {
        try {
            setLoading(true)
            setErrors(null)
            const fetchRes = await fetch(sumaryApi.getAllReview.url.replace(":id", tourId), {
                method: sumaryApi.getAllReview.method,
                headers: {
                    "Content-type": "Application/json"
                }
            })
            const data = await fetchRes.json()
            if (data.success) {

                setReviews(data.data.rating.details)
                // Tính rating breakdown từ reviews
                const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                const totalRatings = data.data.rating.details.length
                const averageRating = data.data?.rating?.average || 0
                data.data.rating.details.forEach(review => {
                    if (review.rating >= 1 && review.rating <= 5) {
                        ratingBreakdown[review.rating] = (ratingBreakdown[review.rating] || 0) + 1
                    }
                })

                setSummary({
                    averageRating: averageRating,
                    totalRatings: totalRatings,
                    ratingBreakdown: ratingBreakdown
                })
                console.log("summary", data.summary);

            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            setErrors(error.message)
        } finally {
            setLoading(false)
        }
    }

    const addReview = async (rating, comment) => {

        const token = localStorage.getItem('accessToken');
        const response = await fetch(sumaryApi.addReview.url.replace(":id", tourId), {
            method: sumaryApi.addReview.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rating, comment })
        });

        const data = await response.json();

        if (data.success) {
            // Tự động fetch lại reviews sau khi thêm mới
            await fetchReviews();
            return data;
        } else {
            throw new Error(data.message);
        }
    }

    useEffect(() => {
        if (tourId) {
            fetchReviews();
        }
    }, [tourId]);

    return {
        reviews,
        loading,
        errors,
        summary,
        fetchReviews,
        addReview,
        refetch: fetchReviews
    }
}
