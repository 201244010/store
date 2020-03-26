- 例子，组件内直接写死了假data。使用时需要改一下props，传data。

```js
<Row gutter={20}>
    <Col span={18}>
        <Card title="多柱年龄区间性别分布">
            <AgeGenderBar />
        </Card>
    </Col>
    <Col span={12}>
        <Card title="单柱随时间">
            <SalesBar />
        </Card>
    </Col>
    <Col span={12}>
        <Card title="单柱随频次">
            <FrequencyBar />
        </Card>
    </Col>
    <Col span={12}>
        <Card title="年龄性别频次分布">
            <FrequencyAgeGenderBar />
        </Card>
    </Col>
</Row>
```
