import React, { useEffect } from "react";
import styles from "./MainPage.module.css";
import { useQuery } from "@apollo/react-hooks";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { GET_DEPTS, GET_EMPLOYEES } from "../queries";
import { Grid } from "@material-ui/core";
import jwtDecode, { JwtPayload } from "jwt-decode";
import EmployeeList from "./EmployeeList";
// import EmployeeCreate from "./EmployeeCreate";
import EmployeeDetails from "./EmployeeDetails";
// import DeptList from "./DeptList";
// import FilterByName from "./FilterByName";
// import FilterByAnd from "./FilterByAnd";
// import Pagination from "./Pagination";
import { withRouter } from 'react-router';


const MainPage = withRouter(() => {
  const {
    loading: loadingDepts,
    data: dataDepts,
    error: errorDepts,
  } = useQuery(GET_DEPTS);

  console.log(`loadingDepts: `,loadingDepts);
  console.log(`dataDepts: `,dataDepts);
  console.log(`errorDepts: `,errorDepts);

  const {
    loading: loadingEmployees,
    data: dataEmployees,
    error: errorEmployees,
  } = useQuery(GET_EMPLOYEES);

  console.log(`loadingEmployees: `,loadingEmployees);
  console.log(`dataEmployees: `,dataEmployees);
  console.log(`errorEmployees: `,errorEmployees);

  // error が発生したら、localStorageに保存されているtokenを削除する
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      const decodedToken: JwtPayload = jwtDecode(currentToken);
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        // 有効期限がきれりたら削除
        localStorage.removeItem("token");
      }
    } else {
      // そもそもtokenが存在しな場合はauthのルートに遷移させる
      window.location.href = "/";
    }
  }, [errorEmployees, errorDepts]);

  if (loadingEmployees || loadingDepts) return <h1>Loading from server</h1>;
  else if (errorEmployees || errorDepts)
    return (
      <>
        <h1>Employee data fetch error : {errorEmployees?.message}</h1>
        <h1>Department data fetch error : {errorDepts?.message}</h1>
      </>
    );

  return (
    <div className={styles.mainPage}>
      <h1>
        GraphQL lesson
        <ExitToAppIcon
          className={styles.mainPage__out}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        />
      </h1>
      <Grid container>
        <Grid item xs={5}>
          <EmployeeList dataEmployees={dataEmployees} />
        </Grid>
        <Grid item xs={4}>
          <EmployeeDetails />
        </Grid>
        {/* <Grid item xs={3}>
          <DeptList dataDepts={dataDepts} />
        </Grid> */}
      </Grid>
      {/* <Grid container>
        <Grid item xs={2}>
          <FilterByName />
        </Grid>
        <Grid item xs={3}>
          <FilterByAnd />
        </Grid>
        <Grid item xs={7}>
          <Pagination />
        </Grid>
      </Grid> */}

    </div>
  );
});

export default MainPage;
