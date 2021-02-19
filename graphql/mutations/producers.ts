
export const CREATE_PRODUCER = `
     mutation CreateProducer ($newProducerData : ProducerInput!){
        createProducer(input:{
            data:$newProducerData                
        }){
            producer{
                name                
            }
        }
    }
`