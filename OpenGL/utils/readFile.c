#include <stdio.h>
#include <stdlib.h>

char* readFile(const char* filename) {
	//Defining input max for fread
	size_t MAX_READ = 1024;

	char* data = (char*) malloc(MAX_READ); 
	char* tmp = NULL;

	//Create file pointer
	FILE* filePtr = fopen(filename, "r");
	size_t stringSize = 0;

	//If file was opened
	if (filePtr) {
		size_t bytesRead;
		do {	//Read
			bytesRead = fread(data, 1, MAX_READ, filePtr);
			if (bytesRead > 0) {
				printf("%i\n", bytesRead);

				int freeAndSwap = 1;
				if (bytesRead < MAX_READ) {
					tmp = (char*) malloc(bytesRead);
					int num = 0;
					
					char* initialData = data;
					char* initialTmp = tmp;
					while (num < bytesRead) {
						*tmp = *data;
						tmp++;
						data++;
						num++;
					}
					
					free(initialData);
					data = initialTmp;
					tmp = initialTmp;
				} else {
					freeAndSwap = 0;
				}
				
				stringSize += bytesRead;
				
				//Copy a new string
				char* out = strcpy((char*) malloc(stringSize), data);
				
				if (freeAndSwap) {
					free(data);
					data = out;
				}
				//printf("%s\n", data);
			}

		} while (bytesRead > 0);
		
		//Close file and dereference
		fclose(filePtr);
		return data;
	}
	printf("File failed to load\n");
	return NULL;
}

int main(int argc, char** argv) {
	char* str = readFile(argv[1]);
	printf("%s\n", str);
}
