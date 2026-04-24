import axios  from "axios";

const topicService = {
    getAllTopics: async () => {
        const response = await axios.get("https://localhost:7050/api/Topic");
        return response;
    }
}

export default topicService;