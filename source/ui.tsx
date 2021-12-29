import { exec } from "child_process";
import React, { FC, useEffect, useState } from "react";
import { Text } from "ink";

const App: FC<{ name?: string }> = () => {
	const [branches, setBranches] = useState<string[]>([]);

	useEffect(() => {
		exec("git branch", (error, stdout, stderr) => {
			if (error) {
				throw error;
			}
			if (stderr) {
				throw stderr;
			}

			const parsedBranches = stdout
				.replace("*", "")
				.split("\n")
				.map((branch) => branch.replace(/\s/g, ""))
				.sort();

			setBranches(parsedBranches);
		});
	}, []);

	return (
		<>
			{branches.map((branch) => (
				<Text key={branch}>{branch}</Text>
			))}
		</>
	);
};

module.exports = App;
export default App;
