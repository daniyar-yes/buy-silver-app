export default function ACase({aCaseMessageString = 'default', numberForA}) {

  // aCaseMessageString - just a string ''
  // numberForA - just a number

  return (
    <div style={{fontStyle: 'italic'}}>
      {aCaseMessageString}
      {numberForA}
    </div>
  )
}


// I'll turn this string: A is larger than B
// into something consumed via PROPS API


// props or {props} (properties) is what your
// React component accepts as an input
// (i.e. function's parameters / arguments)

// and because it accepts props,
// props can be sent to your component

// steps to set and use props properly:

// 1. define the props inside your CHILD component (name and shape)
// 2. remember to actually use the prop inside your CHILD component (read from shape correctly)
// 3. on the PARENT component that USES your component in question
// define a VALUE that you're sending into that CHILD component
// and send that value to a PROP via prop name
// ensure you're sending the same data shape
// that your CHILD component expects to receive