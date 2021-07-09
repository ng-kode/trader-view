import React, { useEffect, useState } from 'react';
import { Upload, Button, AutoComplete, Space, Affix } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { geekblue } from '@ant-design/colors';
import * as d3 from 'd3';
import Chart from './Chart';
import './App.css';

const App = () => {
  const [dataSource, setDataSource] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState(null);

  const extractCategory = item => item['Industry Name'];

  const countCategoryItems = (targetCategory) => (dataSource || []).reduce((acc, curr) => {
    if (extractCategory(curr) === targetCategory) {
      acc += 1;
    }
    return acc;
  }, 0);

  const onFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result
      const data = d3.csvParse(result);
      setDataSource(data);
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    if (!dataSource) {
      return;
    }
    const newOptions = Array.from(new Set(dataSource.map(extractCategory)))
      .map(value => ({ value, label: `(${countCategoryItems(value)}) ${value}` }))
      .sort((a, b) => countCategoryItems(a.value) - countCategoryItems(b.value))
      .reverse();
    console.log('newOptions', newOptions)
    setOptions(newOptions);
    setCategory(newOptions[0]['value'])
  }, [dataSource])

  useEffect(() => {
    setSearchText(category);
  }, [category])

  return (
    <div>
      <Affix>
        <Space size="large" align="center" direction="horizontal" style={{ padding: '.75rem 4rem', width: '100%', backgroundColor: geekblue[geekblue.length - 1] }}>
          <Upload beforeUpload={(file) => { onFileChange(file); return false }} showUploadList={false}>
            <Button ghost color={geekblue[geekblue.length - 1]} icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>

          <Space>
            {dataSource && <AutoComplete
              onSearch={text => setSearchText(text)}
              onSelect={selected => setCategory(selected)}
              value={searchText}
              style={{ width: '20rem' }}
              options={options}
              placeholder="Search Industry"
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />}
            {dataSource && <span>({countCategoryItems(category)})</span>}
          </Space>
        </Space>
      </Affix>

      <div className="container">
        {dataSource && dataSource
          .filter(dat => extractCategory(dat) === category)
          .map(ds => <Chart chart_id={ds['Symbol'].toLowerCase()} symbol={ds['Symbol']} rsRating={ds['RS Rating']} />)}
      </div>
    </div>
  )
};

export default App;