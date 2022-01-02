import App from "./app";
import { BranchesProvider } from "./components/BranchesProvider";

function UI() {
	return (
		<BranchesProvider>
			<App />
		</BranchesProvider>
	);
}

module.exports = UI;
export default UI;
