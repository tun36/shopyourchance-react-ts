
import React,{useState} from 'react';
import {Card,Divider, Space,List, Typography, Button,Modal,message,Result,Upload} from 'antd';
import {Link} from 'react-router-dom';
import {RiDeleteBin6Line} from 'react-icons/ri';
import { UploadOutlined } from '@ant-design/icons';
import {BsHandbag} from 'react-icons/bs';
import {useDispatch} from 'react-redux';
import {httpClient} from './../../interceptors';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {HiOutlineShoppingBag} from 'react-icons/hi';
import {addCart} from './../../redux/actions';
import { useSelector } from "react-redux";
import type { UploadProps } from 'antd';
import {addResume} from './../../redux/actions';
interface Props {
    isCancle?:boolean;
    data:[]
}
const { confirm } = Modal;
const {Text} = Typography;
const App = (props:Props) => {
    const dataRedux = useSelector((state:any) => state.userReducer);
    const dispatch = useDispatch();
    const [visbleModal, setVisbleModal] = useState<boolean>(false);
    const [visbleModalResult, setVisbleModalResult] = useState<boolean>(false);
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
                            setVisbleModalResult(true);
                            dispatch(addCart(response.data.data))
                            setVisbleModal(true);
                        }else{
                            message.error(response.data.message);
                        }
                    });
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
    return (
        <div style={{border:'1px solid #f0f0f0',borderTop:0,padding:24}}>
           
           {props.isCancle?<Divider orientation="left">Jobs ({props.data.length})</Divider>:''}
           <Modal closable={false} open={visbleModalResult} footer={false}>
                <Result
                    status="success"
                    title="Successfully applied"
                    subTitle={
                        <Space direction="vertical">
                            <Space>ทางทีม Talent Acquisition ขอสงวนสิทธิ์พิจารณาคัดเลือกใบสมัครเฉพาะผู้ที่มีคุณสมบัติครบถ้วนตามตำแหน่งงานที่เปิดรับสมัครด้านล่าง</Space>
                        </Space>
                    }
                    extra={[
                    <Link onClick={()=>setVisbleModalResult(false)} to="/profile/job/apply"><Button key="buy">View</Button></Link>,
                    ]}
                    />
            </Modal>
           <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={props.data}
                renderItem={(item:any,index) => (
                <List.Item 
                
                key={index}>
                    <Card >
                        <List.Item.Meta
                        avatar={<BsHandbag />}
                        title={<Link to={`/job/${item?.jobId}`}>{item.position}</Link>}
                        description={
                            <>
                            <Divider style={{margin:'10px 0'}}/>
                            <Space size={0} direction="vertical">
                                {item.statusActive==='N'?<Text type="danger">ปิดรับสมัครชั่วคราว</Text>:''}
                                {!props.isCancle?<Text type="secondary" style={{fontSize:'15px'}}>Apply : 13.06.66</Text>:''} 
                                <Space>
                                    <Button onClick={()=>{
                                        confirm({
                                            title: props.isCancle?'Are you sure remove to cart?':'Are you sure cancel apply?',
                                            icon: <AiOutlineShoppingCart size={40} style={{fontSize:'40px'}}/>,
                                            okText: 'Yes',
                                            okType: 'danger',
                                            cancelText: 'No',
                                            onOk() {
                                                props.isCancle?
                                                httpClient.delete(`/job/cart/${item.jobId}`).then(response=>{
                                                    if(response.data.status===200){
                                                        dispatch(addCart(response.data.data))
                                                        message.success('Remove from cart Success!');
                                                    }else{
                                                        message.error(response.data.message)
                                                    }
                                                })
                                                :
                                                httpClient.delete(`/user/job/${item.jobId}`).then(response=>{
                                                    if(response.data.status===200){
                                                        dispatch(addCart(response.data.data))
                                                        message.success('Cancel Apply Success!');
                                                    }else{
                                                        message.error(response.data.message)
                                                    }
                                                })
                                            }
                                        });
                                    }} icon={props.isCancle?<RiDeleteBin6Line />:''}>{props.isCancle?'ลบออกจากตะกร้า':`ยกเลิกการสมัคร`}</Button>
                                    {props.isCancle?
                                    <Button disabled={item.statusActive==='N'?true:false} type="primary" onClick={()=>{
                                        if(dataRedux.User.resumes.length===0){
                                            setVisbleModalResume(true);
                                            setVisbleModalResumeJobId(item.jobId)
                                        }else{
                                            confirm({
                                                title: 'Are you sure confirm apply this job?',
                                                icon: <HiOutlineShoppingBag size={40} style={{fontSize:'40px'}}/>,
                                                okText: 'Confirm',
                                                okType: 'danger',
                                                cancelText: 'No',
                                                onOk() {
                                                    httpClient.post(`/job/cart/submit`,{
                                                        jobId:item.jobId
                                                    }).then(response=>{
                                                        if(response.data.status===200){
                                                            setVisbleModalResult(true);
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
                                    :''}
                                </Space>
                            </Space>
                            </>
                        }
                        />
                    </Card>
                    <Modal closable={false} open={visbleModal} footer={false}>
                        <Result
                            status="success"
                            title="Successfully Apply Job"
                            subTitle={`Positon : ${item.position}`}
                            extra={[
                            <Button onClick={()=>setVisbleModal(false)} key="console">Cart</Button>,
                            <Link onClick={()=>setVisbleModal(false)} to="/profile/job/apply"><Button key="buy">View</Button></Link>,
                            ]}
                        />
                    </Modal>
                    <Modal onCancel={()=>setVisbleModalResume(false)} title="กรุณาอัพโหลด​ Resume!" open={visbleModalResume} footer={false}>
                        <div style={{marginTop:30,marginBottom:30}}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>Upload Now</Button>
                            </Upload>
                        </div>
                        
                    </Modal>
                </List.Item>
                )}
            />
        </div>
    );
};

export default App;