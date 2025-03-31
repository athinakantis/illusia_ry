import ProtectedData from '../utils/ProtectedData';

const TestProtected = () => {
  return (
    <div>
      <h1>Protected Route Test</h1>
      <p>If you see data below, the protected route is working:</p>
      <ProtectedData />
    </div>
  );
};

export default TestProtected;