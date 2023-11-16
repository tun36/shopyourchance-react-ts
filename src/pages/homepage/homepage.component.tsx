import React,{useState} from 'react';
import {Layout, Button,Row,Col,List, Divider,message} from 'antd';
import HeaderPage from '../../components/headers/header-page.component';
import ItemMenuCategory from '../../components/item-menu-category/item-menu-category.component';
import {DATA_CATEGORY} from './../../data/category.data';
import {LoadingOutlined} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import FOOTER_BG from './../../icons/true_dtac_Graphic_RGB.png';
import { Link } from 'react-router-dom';
import ItemJobList from './../../components/item-job-list/item-job-list.component';
import {JobTyps} from './../../interface/type.interface';
import {httpClient} from './../../interceptors';
const {Content} = Layout;
const App = () => {
    const [resultSearch, setResultSearch] = useState<JobTyps[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    return (
        <Layout className="bg-layout" style={{backgroundImage:`url(${isSearch?'':FOOTER_BG})`}}>
            <HeaderPage loading={loading} onSearch={(value)=>{
                //setLoading(true);
                setIsSearch(true);
                httpClient.get(`/jobs?keyword=${encodeURI(value)}`).then(response=>{
                    if(response.data.status===200){
                        setResultSearch(response.data.data.jobs||[]);
                    }else{
                        message.error(response.data.message)
                    }
                }).finally(()=>setLoading(false));

            }}/>
            <Content >
                <Row gutter={[10,10]}>
                    {loading?
                    <Col span={24} style={{textAlign:"center"}}>
                        <LoadingOutlined style={{fontSize:"40px",color:"red"}}/>
                    </Col>
                    : 
                    <>
                    {isSearch?
                    <>
                    <Col span={24}>
                        <Divider orientation="left">ผลการค้นหา ({resultSearch?.length})</Divider>
                        <Col style={{textAlign:"right"}}><Button onClick={()=>setIsSearch(false)}>กลับสู่หน้าหลัก</Button></Col>
                        <List
                            loading={loading}
                            dataSource={resultSearch}
                            renderItem={(item,index) => <ItemJobList category="" jobId={item.jobId} key={index} title={item.title} bu={item.bu} band={item.band} positionNumber={item.positionNumber} position={item.position}/>}
                        />
                    </Col>
                    </>
                    :
                    <>
                    <Col style={{textAlign:"right"}} span={24}><Link to="/jobs"><Button shape="round">All Jobs</Button></Link></Col>
                    <Col span={24}>
                        <List
                            grid={{ gutter: 16, column: isMobile?2:3 }}
                            dataSource={DATA_CATEGORY}
                            renderItem={(item,index) => (
                            <List.Item data-aos="zoom-in" key={index}>
                                <ItemMenuCategory inline={false} id={item.id} title={item.title} icon={`${item.icon}`}/>
                            </List.Item>
                            )}
                        />
                    </Col>
                    </>
                    }
                    </>}
                </Row>
            </Content>
            
        </Layout>
    );
};

export default App;