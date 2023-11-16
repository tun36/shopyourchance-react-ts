import React,{useEffect,useState} from 'react';
import {Layout,Divider,Row,Col,List,Breadcrumb,message} from 'antd';
import HeaderMenu from '../../components/headers/header-menu.component';
import {Link} from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import ItemJobList from './../../components/item-job-list/item-job-list.component';
import {httpClient} from './../../interceptors';
import {JobTyps} from './../../interface/type.interface';
import FilterJob from './../../components/filter-job/filter-job.component';
import './../../App.scss';
const {Content} = Layout;
const App = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [jobs,setJobs] = useState<JobTyps[]>();
    useEffect(() => {
        
        handleJobs('','','');

    }, []);
    const handleJobs = (category:string,bu:string,jobFuction:string) => {
        setLoading(true);
        httpClient.get(`/jobs?CategoryId=${category}&bu=${bu}&jobFamily=${encodeURI(jobFuction)}`).then(response=>{
            if(response.data.status===200){
                setJobs(response.data.data.jobs||[]);
            }else{
                message.error(response.data.message)
            }
        }).finally(()=>setLoading(false));
    }
    return (
        <Layout className="bg-layout" >
            <HeaderMenu isBack={true}/>
            <Content >
            <Row gutter={[10,10]}>
                    <Col span={24} style={{marginBottom:20}}>
                        <Breadcrumb
                            items={[
                            {
                                title: <Link to="/"><HomeOutlined /></Link>,
                            },
                            {
                                title: 'All Jobs',
                            },
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} style={{paddingBottom:100}}>
                        <Row gutter={[10,10]} >
                        <Col xs={24} sm={24} md={24} lg={24} >
                                <FilterJob onFinish={(value)=>handleJobs(``,`${value.bu||''}`,`${value.jobFamily||''}`)}/>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Divider orientation="left">Jobs ({jobs?.length})</Divider>
                                <List
                                    loading={loading}
                                    dataSource={jobs}
                                    renderItem={(item,index) => <ItemJobList data-aos="fade-down" category="" jobId={item.jobId} key={index} title={item.title} bu={item.bu} band={item.band} positionNumber={item.positionNumber} position={item.position}/>}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
            
        </Layout>
    );
};

export default App;