//@ts-nocheck
import React,{useState,useEffect} from 'react';
import {Layout,Row,Col,Breadcrumb,List,Form,Button,Input,Select,DatePicker,Switch,message} from 'antd';
import HeaderMenu from '../../components/headers/header-menu.component';
import {Link} from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import ItemJobList from './../../components/item-job-list/item-job-list.component';
import {httpClient} from './../../interceptors';
import Card from 'antd/es/card/Card';
import {DATA_CATEGORY_SELECT} from './../../data/category.data';
import {DATA_JOBFUCTION} from './../../data/jobFuction.data';
import {BU} from './../../data/bu.data';
import dayjs from 'dayjs';
import {JobTyps} from './../../interface/type.interface';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { RangePicker } = DatePicker;
const {Content} = Layout;
const App = () => {
    const dateFormat = 'YYYY-MM-DD';
    const [form] = Form.useForm();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [jobScope, setJobScope] = useState<string>('');
    const [qualification, setQualification] = useState<string>('');
    const [allJobs, setAllJobs] = useState<JobTyps[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const handleJobs = () => {
        setLoading(true);
        httpClient.get(`/admin/job`).then(async response=>{
            setAllJobs(response.data.data.jobs);
        }).finally(()=>setLoading(false));
    }
    useEffect(() => {
        handleJobs();
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
                                title:'Admin',
                            },
                            {
                                title:'Jobs',
                            }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={10} xl={10} style={{paddingBottom:100}}>
                        <Card title="Your Job" size="small" >
                            <List
                            loading={loading}
                            dataSource={allJobs}
                            renderItem={(item,index) => <ItemJobList onClickEditJob={()=>{
                                
                                httpClient.get(`/admin/job/${item.jobId}`).then(response=>{
                                    if(response.data.status===200){
                                        setIsUpdate(response.data.data.job.jobId);
                                        const data = {
                                            careerStream:response.data.data.job.title,
                                            vacant:response.data.data.job.positionNumber,
                                            active:true,
                                            date:[dayjs(response.data.data.job.startDate, dateFormat), dayjs(response.data.data.job.endDate, dateFormat)],
                                            ...response.data.data.job
                                        }
                                        form.setFieldsValue(data); 
                                        setQualification(response.data.data.job.qualification);
                                        setJobScope(response.data.data.job.jobScope);
                                    }else{
                                        message.error(response.data.message)
                                    }
                                });

                            }} key={index} jobId={item.jobId} category="" statusActive={item.statusActive} positionNumber={item.positionNumber} isVertical={true} title={item.title} position={item.position} />}
                            />
                        </Card>
                        {/* <Tabs
                            type="card"
                            defaultActiveKey="1"
                            style={{ marginBottom: 32 }}
                            items={tab_data}
                            className="tab-item"
                        /> */}
                    </Col>
                    <Col xs={22} sm={24} md={16} lg={14} xl={14} style={{paddingBottom:100}}>
                        <Card title={isUpdate?'อัพเดทตำแหน่งงาน':'เพิ่มตำแหน่งงาน'} size="small" headStyle={{backgroundColor:"#ff0000",color:"#fff"}}>
                            <Form
                            name="basic"
                            form={form}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            onFinish={(value)=>{
                                const data = {
                                    ...value,
                                    jobScope:jobScope,
                                    qualification:qualification,
                                    active:value.active?'Y':'N',
                                    
                                }
                                setLoading(true);
                                isUpdate?
                                httpClient.patch(`/admin/job/${isUpdate}`,data).then(response=>{
                                    if(response.data.status===200){
                                        
                                    }else{
                                        message.error(response.data.message)
                                    }
                                }).finally(()=>{
                                    handleJobs();
                                    form.resetFields();
                                    message.success('อัพเดทสำเร็จ')
                                })
                                :
                                httpClient.post(`/admin/job`,data).then(response=>{
                                    if(response.data.status===200){
                                        
                                    }else{
                                        message.error(response.data.message)
                                    }
                                }).finally(()=>{
                                    handleJobs();
                                });
                            }}
                            size="large"
                            >
                                <Form.Item
                                label="Category"
                                name="categoryId"
                                rules={[{ required: true, message: 'Please input category!' }]}
                                >
                                    <Select
                                    disabled={loading}
                                    style={{ width: 320 }}
                                    options={DATA_CATEGORY_SELECT}
                                    />
                                </Form.Item>

                                <Form.Item
                                label="Job Function "
                                name="careerStream"
                                rules={[{ required: true, message: 'Please input title!' }]}
                                >
                                    <Select
                                    disabled={loading}
                                    style={{ width: 320 }}
                                    options={DATA_JOBFUCTION}
                                    />
                                </Form.Item>

                                <Form.Item
                                label="Bu"
                                name="bu"
                                rules={[{ required: true, message: 'Please input your BU!' }]}
                                >
                                    <Select
                                    disabled={loading}
                                    style={{ width: 320 }}
                                    options={BU}
                                    />
                                </Form.Item>
                                <Form.Item
                                label="Position"
                                name="position"
                                rules={[{ required: true, message: 'Please input your Position!' }]}
                                >
                                    <Input disabled={loading}/>
                                </Form.Item>
                                <Form.Item
                                label="Band"
                                name="band"
                                rules={[{ required: true, message: 'Please input your Band!' }]}
                                >
                                    <Input disabled={loading}/>
                                </Form.Item>
                                <Form.Item
                                label="Amount"
                                name="vacant"
                                rules={[{ required: true, message: 'Please input your Amount!' }]}
                                >
                                    <Input disabled={loading}/>
                                </Form.Item>
                                <Form.Item
                                label="Job Scope"
                                name="jobScope"
                                rules={[{ required: true, message: 'Please input your Job Scope!' }]}
                                >
                                    
                                    <CKEditor
                                    config={{
                                        height:"1000px"
                                    }}
                                    editor={ ClassicEditor }
                                    data={jobScope}
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        setJobScope(data);
                                    } }
                                    />
                                    {/* <TextArea disabled={loading} rows={5}/> */}
                                </Form.Item>
                                <Form.Item
                                label="Qualification"
                                name="qualification"
                                rules={[{ required: true, message: 'Please input your Qualification!' }]}
                                >
                                     <CKEditor
                                    config={{
                                        height:"1000px"
                                    }}
                                    data={qualification}
                                    editor={ ClassicEditor }
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        setQualification(data);
                                    } }
                                    />
                                    {/* <TextArea disabled={loading} rows={5}/> */}
                                </Form.Item>
                                <Form.Item
                                label="Work Location"
                                name="workLocation"
                                rules={[{ required: true, message: 'Please input your Work Location!' }]}
                                >
                                    <Input disabled={loading}/>
                                </Form.Item>
                                <Form.Item
                                label="Date"
                                name="date"
                                rules={[{ required: true, message: 'Please input your Date!' }]}
                                >
                                    <RangePicker format={dateFormat} disabled={loading}/>
                                </Form.Item>
                                <Form.Item
                                label="Email Recruiter"
                                name="emails"
                                rules={[{ required: true, message: 'Please input your Email Recruiter!' }]}
                                >
                                    <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    tokenSeparators={[',']}
                                    />
                                </Form.Item>
                                <Form.Item
                                label="Active"
                                name="active"
                                >
                                    <Switch disabled={loading} defaultChecked={true} checkedChildren="Y" unCheckedChildren="N"/>
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button loading={loading} type="primary" htmlType="submit">
                                        {isUpdate?'Update':'Submit'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
            
        </Layout>
    );
};

export default App;