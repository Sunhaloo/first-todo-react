function Username({ className, placeholder }) {
  // `input` tag that can be used to enter data
  return <input className={className} type="text" placeholder={placeholder} />;
}

// export as reusable component
export default Username;
