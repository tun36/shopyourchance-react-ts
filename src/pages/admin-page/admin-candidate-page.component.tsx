import React,{useState} from 'react';
import {Layout,Row,Col,Breadcrumb, Divider,Form,DatePicker, Button,message} from 'antd';
import HeaderMenu from '../../components/headers/header-menu.component';
import {Link} from 'react-router-dom';
import { HomeOutlined,DownloadOutlined } from '@ant-design/icons';
import {httpClient} from './../../interceptors';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import './../../App.scss';
const { RangePicker } = DatePicker;
const {Content} = Layout;
const App = () => {
    const dateFormat = 'YYYY-MM-DD';
    const [loading, setLoading] = useState<boolean>();
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
                                title:'Candidate',
                            }
                            ]}
                        />
                    </Col>
                    <Col span={24} style={{paddingBottom:100}}>
                        <Divider orientation="left">ดาวน์โหลดข้อมูลผู้สมัคร</Divider>
                        <Form size="large" name="horizontal_login" layout="inline" onFinish={(value)=>{
                            
                            httpClient.post(`/admin/job/candidate/download`,value, { responseType: 'arraybuffer' }).then(response=>{

                                var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                FileSaver.saveAs(blob, `Candidate_${dayjs(new Date()).format(dateFormat)}.xlsx`);
                                return response?.data
                                   
                                
                            }).finally(()=>{
                                setLoading(false);
                            });
                        }}>
                            <Form.Item
                                name="date"
                                rules={[{ required: true, message: 'Please input your date!' }]}
                            >
                                <RangePicker format={dateFormat}  disabled={loading}/>
                            </Form.Item>
                            <Form.Item shouldUpdate>
                                <Button htmlType="submit" loading={loading} icon={<DownloadOutlined />}>Download Excel file</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
            
        </Layout>
    );
};

export default App;