import { useMutation } from '@apollo/client';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { GET_TOKEN, CREATE_USER } from '../queries'; 
import styles from "./Auth.module.css";
import FlipCameraAndroidIcon from "@material-ui/icons/FlipCameraAndroid";
import { withRouter } from 'react-router';


const Auth = withRouter(() => { // routerをTypecSriptで利用するために必要
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [getToken] = useMutation(GET_TOKEN); // Graphqlのmutation機能をReact内でつかえるようにしている
  const [createUser] = useMutation(CREATE_USER); // Graphqlのmutation機能を React内でつかえるようにしている
  const [isLogin, setIsLogin] = useState(true);

  const authUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const result = await getToken({
          variables: { username: username, password: password },
        });
        localStorage.setItem("token", result.data.tokenAuth.token);
        result.data.tokenAuth.token && (window.location.href = "/employees");
      } catch (err) {
        alert(err.message);
      }
    } else {
      try {
        await createUser({
          variables: { username: username, password: password },
        });
        const result = await getToken({
          variables: { username: username, password: password },
        });
        localStorage.setItem("token", result.data.tokenAuth.token);
        result.data.tokenAuth.token && (window.location.href = "/employees");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Authコンポーネントがマウントされた最初の1回だけ実行される トークンが有効かどうかチェック
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if(currentToken) {
      const decodedToken: JwtPayload = jwtDecode(currentToken);
      if(decodedToken.exp && decodedToken.exp * 1000 < Date.now()){ 
        localStorage.removeItem("token"); // tokenが期限切れの場合削除
      } else {
        window.location.href= "/employees"; // tokenが有効なときはMainPageにとぶ Routerでpath設定済
      }
    }
  }, []);

  return (
    <div className={styles.auth}>
      <form onSubmit={authUser}>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </form>
      <button type="submit">
        {isLogin ? "Login with JWT" : "Create new user"}
      </button>
      <div>
        <FlipCameraAndroidIcon 
          className={styles.auth__toggle}
          onClick={() => {setIsLogin(!isLogin)}}
        />
      </div>

      
    </div>
  )
});

export default Auth;
