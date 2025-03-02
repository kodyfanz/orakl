import { ethers } from 'hardhat'
import hre from 'hardhat'

async function main() {
  const vrfConsumerMock = await ethers.getContract('VRFConsumerMock')
  const { consumer } = await hre.getNamedAccounts()

  const vrfConsumerSigner = await ethers.getContractAt(
    'VRFConsumerMock',
    vrfConsumerMock.address,
    consumer
  )

  const keyHash = '0x47ede773ef09e40658e643fe79f8d1a27c0aa6eb7251749b268f829ea49f2024'
  const callbackGasLimit = 500_000
  const numWords = 1

  await vrfConsumerSigner.requestRandomWordsDirect(keyHash, callbackGasLimit, numWords, {
    value: ethers.utils.parseEther('1.0')
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
