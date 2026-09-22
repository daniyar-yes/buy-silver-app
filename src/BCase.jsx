import { bCase as paragraphForThirdHeader } from "./stringForExport"

const BCase = () => {
  return (
    <div style={{ fontStyle: 'italic' }}>
      {`${paragraphForThirdHeader.operand1} ${paragraphForThirdHeader.comparison} ${paragraphForThirdHeader.operand2}`}
    </div>
  )
}

export default BCase