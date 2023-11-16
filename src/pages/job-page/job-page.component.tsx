import React,{useEffect,useState} from 'react';
import {Layout,Row,Col, Typography,Breadcrumb, Button, Skeleton,Modal,message,Result,Upload, Space} from 'antd';
import HeaderMenu from '../../components/headers/header-menu.component';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {Link,useParams} from 'react-router-dom';
import { HomeOutlined,UploadOutlined } from '@ant-design/icons';
import {httpClient} from './../../interceptors';
import {JobTyps} from './../../interface/type.interface';
import {FcCancel} from 'react-icons/fc';
import {useDispatch} from 'react-redux';
import { useSelector } from "react-redux";
import {HiOutlineShoppingBag} from 'react-icons/hi';
import {addCart} from './../../redux/actions';
import type { UploadProps } from 'antd';
import {addResume} from './../../redux/actions';
import './../../App.scss';
import Card from 'antd/es/card/Card';
const { Title, Paragraph, Text } = Typography;
const {Content} = Layout;
const { confirm } = Modal;
const App = () => {
    const dataRedux = useSelector((state:any) => state.userReducer);
    const [visbleModalResume, setVisbleModalResume] = useState<boolean>(false);
    const [visbleModalResumeJobId, setVisbleModalResumeJobId] = useState<string>('');
    const propsUpload: UploadProps = {
        
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
                    httpClient.post(`/job/cart/submit`,{
                        jobId:visbleModalResumeJobId
                    }).then(response=>{
                        if(response.data.status===200){
                            dispatch(addCart(response.data.data))
                            setVisbleModal(true);
                        }else{
                            message.error(response.data.message);
                        }
                    }).finally(()=>setVisbleModalResume(false));
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
    const dispatch = useDispatch();
    let { id } = useParams();
    let { category } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [job,setJob] = useState<JobTyps>();
    const [visbleModal, setVisbleModal] = useState<boolean>(false);
    const handleGetJos = () => {
        setLoading(true);
        httpClient.get(`/job/${id}`).then(response=>{
            if(response.data.status===200){
                setJob(response.data.data.job); 
            }else{
                message.error(response.data.message)
            }
        }).finally(()=>setLoading(false));
    }
    useEffect(() => {
        handleGetJos();
        
    }, []);
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
                                    title: category?<Link to={`/category/${encodeURIComponent(decodeURIComponent(`${category}`))}`}>{decodeURIComponent(`${category}`)}</Link>:<Link to="/jobs">All Jobs</Link>,
                                },
                                {
                                    title: job?.title,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={24} style={{paddingBottom:100}}>
                        <Card>
                            
                            <Typography data-aos="fade-up">
                                <Skeleton active loading={loading}>
                                    <Title level={4}>{job?.position}</Title>
                                    <Paragraph><Text strong>Job Family : </Text>{job?.title}</Paragraph>
                                </Skeleton>
                                <Skeleton active loading={loading}>
                                <Paragraph>
                                    <Text strong>Job Scope : </Text>
                                    <blockquote style={{whiteSpace: "pre-wrap"}}>
                                        <div dangerouslySetInnerHTML={{ __html: `${job?.jobScope}` }} />
                                    </blockquote>
                                </Paragraph>
                                </Skeleton>
                                <Skeleton active loading={loading}>
                                <Paragraph>
                                    <Text strong>Qualification : </Text>
                                    <blockquote style={{whiteSpace: "pre-wrap"}}>
                                        <div dangerouslySetInnerHTML={{ __html: `${job?.qualification}` }} />
                                    </blockquote>
                                </Paragraph>
                                </Skeleton>
                                <Skeleton active loading={loading}>
                                <Paragraph><Text  strong>จำนวนที่เปิดรับสมัคร : </Text> {job?.positionNumber} position</Paragraph>
                                <Paragraph><Text strong>Work Location : </Text> {job?.workLocation}</Paragraph>
                                {job?.statusText==='WAIT'?
                                <Row gutter={[10,10]}>   
                                    <Col span={12}>
                                        <Button danger block size="large" icon={<AiOutlineShoppingCart />} onClick={()=>{
                                            confirm({
                                                title: 'Are you sure cancel apply?',
                                                icon: <FcCancel size={40} style={{fontSize:'40px'}}/>,
                                                okText: 'Yes',
                                                okType: 'danger',
                                                cancelText: 'No',
                                                onOk() {
                                                    httpClient.delete(`/job/cart/${id}`).then(response=>{
                                                        if(response.data.status===200){
                                                            dispatch(addCart(response.data.data))
                                                            message.success('Remove from cart Success!');
                                                        }else{
                                                            message.error(response.data.message)
                                                        }
                                                    }).finally(()=>handleGetJos());
                                                }
                                            });
                                        }}>Remove from your cart</Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button danger block size="large" type="primary" onClick={()=>{
                                            if(dataRedux.User.resumes.length===0){
                                                setVisbleModalResume(true);
                                                setVisbleModalResumeJobId(`${id}`)
                                            }else{
                                                confirm({
                                                    title: 'Are you sure confirm apply this job?',
                                                    icon: <HiOutlineShoppingBag size={40} style={{fontSize:'40px'}}/>,
                                                    okText: 'Confirm',
                                                    okType: 'danger',
                                                    cancelText: 'No',
                                                    onOk() {
                                                        httpClient.post(`/job/cart/submit`,{
                                                            jobId:id
                                                        }).then(response=>{
                                                            if(response.data.status===200){
                                                                dispatch(addCart(response.data.data))
                                                                setVisbleModal(true);
                                                            }else{
                                                                message.error(response.data.message);
                                                            }
                                                        });
                                                        
                                                    }
                                                });
                                            }
                                        }}>Confirm Apply job</Button>
                                    </Col>
                                </Row>
                                :job?.statusText==='CONFIRM'?
                                <Row gutter={[10,10]}>   
                                    <Col span={24}>
                                        <Button danger block size="large" icon={<AiOutlineShoppingCart />} onClick={()=>{
                                            confirm({
                                                title: 'Are you sure cancel apply?',
                                                icon: <FcCancel size={40} style={{fontSize:'40px'}}/>,
                                                okText: 'Yes',
                                                okType: 'danger',
                                                cancelText: 'No',
                                                onOk() {
                                                    httpClient.delete(`/user/job/${id}`).then(response=>{
                                                        if(response.data.status===200){
                                                            dispatch(addCart(response.data.data))
                                                            message.success('Cancel Apply Success!');
                                                        }else{
                                                            message.error(response.data.message)
                                                        }
                                                    }).finally(()=>handleGetJos());
                                                }
                                            });
                                        }}>ยกเลิกการสมัครงานตำแหน่งนี้</Button>
                                    </Col>
                                </Row>
                                
                                :
                                <Row gutter={[10,10]}>
                                    <Col span={12}>
                                        <Button onClick={()=>{
                                        confirm({
                                            title: 'Are you sure add to cart?',
                                            icon: <AiOutlineShoppingCart size={40} style={{fontSize:'40px'}}/>,
                                            okText: 'Yes',
                                            okType: 'danger',
                                            cancelText: 'No',
                                            onOk() {
                                                httpClient.post(`/job/cart/add`,{
                                                    jobId:id
                                                }).then(response=>{
                                                    if(response.data.status===200){
                                                        dispatch(addCart(response.data.data))
                                                        message.success('Add to cart Success!');
                                                    }else{
                                                        message.error(response.data.message)
                                                    }
                                                }).finally(()=>handleGetJos());
                                            }
                                        });
                                    }} icon={<AiOutlineShoppingCart />} block size="large">Add to cart</Button></Col>
                                    <Col span={12}>
                                        <Button type="primary" onClick={()=>{
                                            if(dataRedux.User.resumes.length===0){
                                                setVisbleModalResume(true);
                                                setVisbleModalResumeJobId(`${id}`)
                                            }else{
                                                confirm({
                                                    title: 'Are you sure confirm apply this job?',
                                                    icon: <HiOutlineShoppingBag size={40} style={{fontSize:'40px'}}/>,
                                                    okText: 'Confirm',
                                                    okType: 'danger',
                                                    cancelText: 'No',
                                                    onOk() {
                                                        httpClient.post(`/job/cart/submit`,{
                                                            jobId:id
                                                        }).then(response=>{
                                                            if(response.data.status===200){
                                                                dispatch(addCart(response.data.data))
                                                                setVisbleModal(true);
                                                            }else{
                                                                message.error(response.data.message);
                                                            }
                                                        }).finally(()=>setVisbleModalResume(false));
                                                        
                                                    }
                                                });
                                            }
                                        }} block size="large">Apply Now</Button>
                                    </Col>
                                </Row>
                                }
                                </Skeleton>
                            </Typography>
                        </Card>
                    </Col>
                </Row>
            </Content>
            <Modal onCancel={()=>setVisbleModalResume(false)} title="กรุณาอัพโหลด​ Resume!" open= {visbleModalResume} footer={false}>
                <div style={{marginTop:30,marginBottom:30}}>
                    <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>Upload Now</Button>
                    </Upload>
                </div>
            </Modal>
            <Modal closable={false} open={visbleModal} footer={false}>
                <Result
                    status="success"
                    title="Successfully applied"
                    subTitle={
                        <Space direction="vertical">
                            
                            <Space>ทางทีม Talent Acquisition ขอสงวนสิทธิ์พิจารณาคัดเลือกใบสมัครเฉพาะผู้ที่มีคุณสมบัติครบถ้วนตามตำแหน่งงานที่เปิดรับสมัครด้านล่าง</Space>
                            <Space>Positon : {job?.position}</Space>
                        </Space>
                    }
                    extra={[
                    <Link onClick={()=>setVisbleModal(false)} to="/profile/job/apply"><Button key="buy">View</Button></Link>,
                    ]}
                    />
            </Modal>
        </Layout>
    );
};

export default App;