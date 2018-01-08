#include "stdio.h"
#include "stdlib.h"

int main() {
	
	int stuff[4][4] = { { 1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12} , {13, 14, 15, 16} };
	int* other = malloc(sizeof(int));
	int multi[4][4];

	memcpy(multi, stuff, 4 * 16);

	printf("%i\n", sizeof(int) * 16);

	memcpy(other, stuff, sizeof(stuff));
	printf("copied\n");

	for (int x = 0; x < 16; x++) {
		printf("%i\n", (int) *other);
		other++;
	}

	for (int x = 0; x < 4; x++) {
		for (int y = 0; y < 4; y++) {
			printf("%i\n", multi[x][y]);
		}
	}
}
