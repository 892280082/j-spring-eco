import { start, end } from '../web/app';
import axios from 'axios';

describe('blah', () => {
  beforeAll(done => {
    start(2000).then(done);
  });

  afterAll(done => {
    end(done);
  });

  it('test connect', async () => {
    console.log('测试链接');

    const result = await axios.get(
      'http://localhost:2000/student/getConnectMsg'
    );

    expect(result.data).toEqual('is-ok');
  });

  it('test send paramter', async () => {
    console.log('测试传递参数');

    const result = await axios.get(
      'http://localhost:2000/student/testParamter/123?b=' + 456
    );

    expect(result.data).toEqual('123456');
  });

  it('test shuttle api', async () => {
    const result = await axios.post('http://localhost:2000/shuttleApi/say', {
      args: [2, 'h'],
    });

    expect(result.data).toEqual('hh');
  });

  it('test testDiyMiddleWare api', async () => {
    const result = await axios.get(
      'http://localhost:2000/student/testDiyMiddleWare'
    );

    expect(result.data).toEqual(1);
  });
});
