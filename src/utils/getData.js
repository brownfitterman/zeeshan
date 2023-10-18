
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";

export const getData=(db)=>{
  
    const [value, loading, error] = useCollection(
        firebase.firestore().collection(db).orderBy("orderId", "desc"),
        {
          snapshotListenOptions: { includeMetadataChanges: true },
        }
      );

     return value
}