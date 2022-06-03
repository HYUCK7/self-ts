// 블록체인, 어떤 숫자 값을 입력했을 때, 그 숫자값에 대한 항상 해쉬값을 준다. *결정론적
import crypto from 'crypto' // * 호출이 싫다면, tsconfig에서 esmodul~:true로 수정
// JS 패키지인 crypto를 Ts한테 설명해줄 파일이 필요함.
interface BlockShape{
    hash: string
    prevHash: string //이전 해쉬 값
    height: number // 블록 위치
    data: string  // 블록을 보호할 데이터
} // 해쉬는 블록의 고유서명(시그니처)

class Block implements BlockShape{ // 블록의 Hash 값은 위 외 값들로 계산됨.
    public hash: string
    constructor(
        public prevHash: string,
        public height: number,
        public data: string
    ) {
        this.hash = Block.calculateHash(prevHash, height, data) // 클래스 인스턴스가 없어도 부를 수 있는 함수 = static
    }
    static calculateHash(prevHash: string, height: number, data: string){
        const toHash = `${prevHash} ${height} ${data}`
        return crypto.createHash("sha256").update(toHash).digest("hex")
        // static일 경우 클래스의 인스턴스가 없어도 호출할 수 있음. new 생성이 필요가 없음.
    }
}
class Blockchain{
    private blocks: Block[]
    constructor(){
        this.blocks = [];
    }
    private getPrevHash(){ // blocks의 길이인 this.blocks.length가 0이라면, 첫 번째해쉬가 없기 때문에 "" 리턴
                            // 그게 아니라면 마지막 블록의 해쉬값을 리턴함.
        if(this.blocks.length === 0) return ""
        return this.blocks[this.blocks.length -1].hash;
    }
    public addBlock(data:string){
        const newBlock = new Block(this.getPrevHash(), this.blocks.length +1 ,data)
        this.blocks.push(newBlock)
    }
    public getBlocks(){
        return [...this.blocks]; // 배열 안에 있는 데이터를 가진 새로운 배열을 리턴
    }
}

const blockchain = new Blockchain()

blockchain.addBlock("First one")
blockchain.addBlock("Second one")
blockchain.addBlock("Third one")

console.log(blockchain.getBlocks())