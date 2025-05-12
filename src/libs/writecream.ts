interface Message {
    role: "system" | "assistant" | "user",
    content: string;
}

class WriteCream {
    private messages: Array<Message> = [{
        role: "system",
        content: "Your name is Utilis. You are discord's bot. Your creator is 'tanahiro2010'. You are very intelligence ai assistant.You must reply in the Markdown format of Discord because you are operated on Discord."
    }];
    private readonly endpoint: string = "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat?link=writecream.com&query=";
    constructor() {}

    async askGemini(message: string): Promise<null | string> {
        if (this.messages.length >= 21) {
            this.messages = [];
        }

        this.messages.push({
            role: "user",
            content: message
        });

        const query = encodeURIComponent(JSON.stringify(this.messages));
        const url = `${this.endpoint + query}`;
        const response: Response = await fetch(url);
        const data = await response.json();

        if ((data.status as string).toLowerCase() == "success") {
            this.messages.push({
                role: "assistant",
                content: data.response_content
            });
            return data.response_content;
        } else {
            return null;
        }
    }
}

export { WriteCream };