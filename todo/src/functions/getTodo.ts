import { document } from "../utils/dynamodbClient";

export const handle = async (event) => {

    const { userid: user_id } = event.pathParameters;


    const response = await document.query({
        TableName: "users_todos",
        IndexName: "UserIdIndex",
        KeyConditionExpression: "user_id = :userid",
        ExpressionAttributeValues: {
            ":userid": user_id
        },
        ScanIndexForward: true,
        ConsistentRead: false,
        Select: 'ALL_ATTRIBUTES',
    }).promise();

    const user = response.Items[0];    

    if(!user){
        return{
            statusCode: 400,
            body: JSON.stringify({
                message: "User não existe.",            
            })
        }
    }

    return { 
        statusCode: 200,
        body: JSON.stringify({
            message: "Todo lista!",
            content: response,
        }),
        headers: {
            "Content-type": 'application/json',
        },
    };
}