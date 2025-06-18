import { expect } from 'chai';
import { parseNbtString, NbtObject, NbtList } from '../src/snbt';

describe('NBT Parser', () => {
  it('should parse simple compound', () => {
    const result = parseNbtString(`{ name: "Steve", age: 30 }`);
    expect(result).to.be.instanceOf(NbtObject);
    expect(result.get('name').value).to.equal('Steve');
    expect(result.get('age').value).to.equal(30);
  });

  it('should handle nested compounds', () => {
    const result = parseNbtString(`{ player: { pos: [100, 64, -200] } }`);
    expect(result.get('player')).to.be.instanceOf(NbtObject);
    expect(result.get('player.pos')).to.be.instanceOf(NbtList);
  });

  it('should support all number types', () => {
    const result = parseNbtString(`{ 
      byte: 127b, 
      short: 32767s, 
      int: 2147483647,
      long: 2147483648L,
      float: 3.14f,
      double: 3.1415926535d
    }`);
    
    expect(result.get('byte').value).to.equal(127);
    expect(result.get('byte').unit).to.equal('b');
  });

  // 添加更多测试用例...
});
