import { useMutation } from '@apollo/client';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { GET_TOKEN, CREATE_USER } from '../queries'; 
import styles from "./Auth.module.css";
import FlipCameraAndroidIcon from "@material-ui/icons/FlipCameraAndroid";


const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [getToken] = useMutation(GET_TOKEN); // Graphqlのmutation機能をReact内でつかえるようにしている
  const [createUser] = useMutation(CREATE_USER); // Graphqlのmutation機能をReact内でつかえるようにしている
  const [isLogin, setIsLogin] = useState(true);

  // Authコンポーネントがマウントされた最初の1回だけ実行される
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if(currentToken) {
      const decodeToken: JwtPayload = jwtDecode(currentToken);
      if(decodeToken.exp && decodeToken.exp * 1000 < Date.now()){ 
        localStorage.removeItem("token"); // tokenが期限切れの場合削除
      } else {
        window.location.href= "/employees"; // tokenが有効なときはMainPageにとぶ Routerでpath設定済
      }
    }
  }, [])


  return (
    <div className={styles.auth}>
      <form>
        <div className={styles.auth__input}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.auth__input}>
          <label>Password: </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </form>
      <button type="submit">
        {isLogin ? "Login with JWT" : "Create new user"}
      </button>
      <div>
        <FlipCameraAndroidIcon />
      </div>

      
    </div>
  )
}

export default Auth
