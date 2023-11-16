import React,{useEffect} from 'react';
import { Route, Routes, BrowserRouter,Outlet,Navigate,useSearchParams } from 'react-router-dom';
import HomePage from './pages/homepage/homepage.component';
import CategoryPage from './pages/category-page/category-page.component';
import JobPage from './pages/job-page/job-page.component';
import ProfileJobPage from './pages/profile-job-page/profile-job-page.component';
import AdminPageJobs from './pages/admin-page/admin-job-page.component';
import AdminPageCandidate from './pages/admin-page/admin-candidate-page.component';
import JobAllPage from './pages/job-page/job-all-page.component';
import {httpClient} from './interceptors';
import {useSelector} from 'react-redux';
import {addUser} from './redux/actions';
import { useDispatch } from "react-redux";
const App = () => {
  const dispatch = useDispatch();
  const dataRedux = useSelector((state:any) => state.userReducer);
  useEffect(() => {
    httpClient.get(`/user`).then(async response=>{
      await dispatch(addUser(response.data.data));
    });
  }, []);
  return (
    <BrowserRouter basename="service/app/shopyourchance"> 
      <Routes>
        <Route  path='/' element={<HomePage />}  />
        <Route  path='/category/:id' element={<CategoryPage />}  />
        <Route path='/auth' element={<Auth />}  />
        <Route  path='/job/:id' element={<JobPage />}  />
        <Route  path='/jobs' element={<JobAllPage />}  />
        <Route  path='/job/:category/:id' element={<JobPage />}  />
        <Route  path='/profile/job/:id' element={<ProfileJobPage />}  />
        {dataRedux.User.admin?
        <>
        <Route  path='/admin/job' element={<AdminPageJobs />}  />
        <Route  path='/admin/candidate' element={<AdminPageCandidate />}  />
        </>
        :''}
      </Routes>
    </BrowserRouter>
    
  );
};
const Auth = () => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const data = {
      accessToken:searchParams.get('token')
    }
    localStorage.setItem('_shopyourchance',JSON.stringify(data));
  }, [searchParams.get('token')]);
  return <Navigate to={`/`} replace/>;
}
const ProtectedRoute = ({ user, redirectPath = '/login' }:any) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default App;