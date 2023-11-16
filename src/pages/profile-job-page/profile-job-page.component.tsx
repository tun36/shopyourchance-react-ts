import React,{useState,useEffect} from 'react';
import {Layout,Row,Col,Breadcrumb, Tabs,Badge, Skeleton,Alert,Button,Upload,message} from 'antd';
import HeaderMenu from '../../components/headers/header-menu.component';
import {Link,useParams} from 'react-router-dom';
import { HomeOutlined,UploadOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {HiOutlineShoppingBag} from 'react-icons/hi';
import JobTabs from './../profile-job-page/job-tab.component';
import { useSelector } from "react-redux";
import './../../App.scss';
import Card from 'antd/es/card/Card';
import type { UploadProps } from 'antd';
import {httpClient} from './../../interceptors';
import {addResume} from './../../redux/actions';
import { useDispatch } from "react-redux";
const {Content} = Layout;
const App = () => {
    const dispatch = useDispatch();
    const dataRedux = useSelector((state:any) => state.userReducer);
    const props: UploadProps = {
        
        fileList: dataRedux.User?.resumes?.map((item: any) => {
            return {
                uid: `${item.mediaId}`,
                name: item.fileName,
                status: 'done',
                url: item.url,
            }
        }),
        beforeUpload(value){
            const formData = new FormData();
            if(value){
                formData.append('resumes',value)
            }
            httpClient.post(`/user/media`,formData)
            .then(response=>{
                if(response.data.status===200){
                    dispatch(addResume(response.data.response.resumes))
                    // const data = [...dataRedux.User.resumes,response.data.data.resumes]
                    // console.log('data',data)
                }
            });
        },
        onRemove(val){
            httpClient.delete(`/user/media/${val.uid}`).then(response=>{
                if(response.data.status===200){
                    dispatch(addResume(response.data.response.resumes))
                }else{
                    message.error(response.data.message);
                }
            });
        },
        onChange(info) {
         
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
    };
    
    let { id } = useParams();
    const [activeKey, setActiveKey] = useState('1');
    const items: TabsProps['items'] = [
        {
          key: '1',
          label: <Badge size="small" count={dataRedux.User?.carts?.length}><AiOutlineShoppingCart /> Cart</Badge>,
          children: <JobTabs data={dataRedux.User.carts} isCancle={true}/>,
        },
        {
          key: '2',
          label: <Badge size="small" count={dataRedux.User?.applys?.length}><HiOutlineShoppingBag /> งานที่สมัครแล้ว</Badge>,
          children:<JobTabs data={dataRedux.User.applys}/>,
        }
    ];
    useEffect(() => {
        setActiveKey(id==='cart'?'1':'2') 
    }, [id]);
    
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
                                title:'Your profile jobs',
                            }
                            ]}
                        />
                    </Col>
                    
                    <Col xs={24} sm={24} md={16} lg={16} style={{paddingBottom:100}}>
                        <Skeleton active loading={dataRedux.User.firstname?false:true}>
                        <Tabs
                            onChange={(e)=>setActiveKey(e)}
                            activeKey={activeKey}
                            defaultActiveKey={activeKey}
                            type="card"
                            size="large"
                            items={items}
                        />
                        </Skeleton>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        {dataRedux.User?.resumes?.length===0?
                        <Alert
                        message="กรุณาอัพโหลด Resume"
                        type="error"
                        action={
                            <Upload {...props} >
                                <Button icon={<UploadOutlined />}>Upload Now!</Button>
                            </Upload>
                        }
                        closable={false}
                        />
                        :
                        <Card title="Your Resume" size="small">
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Card>
                        }
                    </Col>
                </Row>
            </Content>
            
        </Layout>
    );
};

export default App;