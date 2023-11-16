import React,{useEffect,useState} from 'react';
import {Layout,Divider,Row,Col,List,Breadcrumb,Empty,Button, message} from 'antd';
import HeaderMenu from '../../components/headers/header-menu.component';
import ItemMenuCategory from './../../components/item-menu-category/item-menu-category.component';
import {Link,useParams} from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import {DATA_CATEGORY} from './../../data/category.data';
import ItemJobList from './../../components/item-job-list/item-job-list.component';
import {httpClient} from './../../interceptors';
import {JobTyps} from './../../interface/type.interface';
import './../../App.scss';
const {Content} = Layout;
const App = () => {
    let { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [category, setCategory] = useState<any>();
    const [jobs,setJobs] = useState<JobTyps[]>();
    useEffect(() => {
        const result = DATA_CATEGORY.find(element => element.title === decodeURI(`${id}`));
        if(result){
            setCategory(result)
        }
        handleJobs(`${encodeURI(decodeURI(`${id}`))}`,'');

    }, [id]);
    const handleJobs = (category:string,bu:string) => {
        setLoading(true);
        httpClient.get(`/jobs?CategoryId=${category}&bu=${bu}`).then(response=>{
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
                {category?.id?
                <Row gutter={[10,10]}>
                    <Col span={24} style={{marginBottom:20}}>
                        <Breadcrumb
                            items={[
                            {
                                title: <Link to="/"><HomeOutlined /></Link>,
                            },
                            {
                                title: category?.title||'',
                            },
                            ]}
                        />
                    </Col>
                    
                    <Col xs={24} sm={24} md={24} lg={24} style={{paddingBottom:100}}>
                        <ItemMenuCategory  id={category?.id||''} inline={true} title={category?.title||''} icon={category?.icon||''}/>
                        <Row gutter={[10,10]} style={{marginTop:20}} data-aos="fade-up">
                            
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Divider orientation="left">Jobs ({jobs?.length})</Divider>
                                <List
                                    loading={loading}
                                    dataSource={jobs}
                                    renderItem={(item,index) => <ItemJobList category={decodeURIComponent(`${id}`)} jobId={item.jobId} key={index} title={item.title} bu={item.bu} band={item.band} positionNumber={item.positionNumber} position={item.position}/>}
                                />
                            </Col>
                        </Row>
                        
                    </Col>
                </Row>
                :<Empty description="No data jobs" image={Empty.PRESENTED_IMAGE_SIMPLE}><Link to="/"><Button>Go to Home</Button></Link></Empty>}
            </Content>
            
        </Layout>
    );
};

export default App;