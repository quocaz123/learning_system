import axios from "axios";

const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL;
const RAPIDAPI_KEY = import.meta.env.VITE_JUDGE0_API_KEY;

const languageIds = {
    python: 71, // Python 3
    perl: 85    // Perl
};

export const runCodeJudge0 = async (source_code, language) => {
    const language_id = languageIds[language] || 71;
    const options = {
        method: 'POST',
        url: JUDGE0_API_URL,
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': RAPIDAPI_KEY
        },
        data: {
            source_code,
            language_id
        }
    };
    const res = await axios.request(options);
    return res.data;
}; 