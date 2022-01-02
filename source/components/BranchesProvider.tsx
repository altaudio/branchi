import { createContext, ReactNode, useEffect, useState } from "react";
import { exec } from "child_process";

interface FilteredBranch {
	name: string;
	index: number;
	current: boolean;
}
interface Branch {
	name: string;
}

type BranchesContext = {
	branches: Branch[];
	filteredBranches: FilteredBranch[];
	setFilteredBranches: (branches: Branch[]) => void;
	currentBranch: FilteredBranch | null;
	decreaseCurrentIndex: () => void;
	increaseCurrentIndex: () => void;
};

const BranchesContext = createContext<BranchesContext>({
	branches: [],
	filteredBranches: [],
	currentBranch: null,
	setFilteredBranches: () => {
		return;
	},
	decreaseCurrentIndex: () => {
		return;
	},
	increaseCurrentIndex: () => {
		return;
	},
});

function BranchesProvider({ children }: { children: ReactNode }) {
	const [branches, setBranches] = useState<Branch[]>([]);
	const [filteredBranches, setFilteredBranches] = useState<FilteredBranch[]>(
		[]
	);
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const decreaseCurrentIndex = () => {
		const nextIndex = currentIndex - 1;

		if (nextIndex < 0) {
			return;
		}

		setCurrentIndex(nextIndex);
	};

	const increaseCurrentIndex = () => {
		const nextIndex = currentIndex + 1;

		if (nextIndex > filteredBranches.length - 1) {
			return;
		}

		setCurrentIndex(nextIndex);
	};

	useEffect(() => {
		setFilteredBranches(
			filteredBranches.map((branch) => ({
				...branch,
				current: branch.index === currentIndex,
			}))
		);
	}, [currentIndex]);

	const mapFiltered = (branches: Branch[]) =>
		branches.map(({ name }, index) => ({
			name,
			index,
			current: index === currentIndex,
		}));

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
				.map((branch, index) => ({
					index,
					name: branch,
					current: index === currentIndex,
				}))
				.sort();

			setBranches(parsedBranches);
			setFilteredBranches(parsedBranches);
		});
	}, []);

	const updateFilteredBranches = (branches: Branch[]) => {
		setFilteredBranches(mapFiltered(branches));
	};

	const currentBranch = filteredBranches[currentIndex] || null;

	return (
		<BranchesContext.Provider
			value={{
				branches,
				filteredBranches,
				setFilteredBranches: updateFilteredBranches,
				increaseCurrentIndex,
				decreaseCurrentIndex,
				currentBranch,
			}}
		>
			{children}
		</BranchesContext.Provider>
	);
}

export { BranchesProvider, BranchesContext };
