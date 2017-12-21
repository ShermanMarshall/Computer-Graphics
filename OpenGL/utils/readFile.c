#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <commonImprovements.h>

char* readFile(const char* filename) {
	//Defining input max for fread
	size_t MAX_READ = 1024;

	char* data = (char*) malloc(SIZEOF_CHAR * MAX_READ); 
	char* tmp = NULL;

	//Create (Non-RAAI) file pointer
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
				
				//Copy a new string
				char* out = strcpy((char*) malloc(SIZEOF_CHAR * (stringSize + bytesRead)), data);
				stringSize += bytesRead;
				
				if (freeAndSwap) {
					free(data);
					data = out;
				}
				printf("%s\n", data);
			}

		} while (bytesRead > 0);
		
		fclose(filePtr);
		return data;
	}
	return NULL;
}

int main() {
	char* str = readFile("fileToReadGoesHere");
	printf("%s\n", str);
}
