import { useEffect, useState } from "react";
import { exec } from "child_process";

function useAllBranches() {
	const [branches, setBranches] = useState<{ name: string }[]>([]);

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
				.filter((branch) => !!branch)
				.map((branch, index) => ({ index, name: branch }))
				.sort();

			const firstBranch = parsedBranches[0];

			if (!firstBranch) {
				throw new Error("No first branch found!");
			}

			setBranches(parsedBranches);
		});
	}, []);

	return { branches };
}

export { useAllBranches };
