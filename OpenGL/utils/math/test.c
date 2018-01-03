#include <stdio.h>
#include <stdlib.h>
#include "test.h"

typedef struct {
	void (* name)();
} Object;

void func() {
	printf("Function called\n");
}

Object* getObject() {
	static Object one[1];
	printf("Static reference\n");
	if (one->name == NULL) {
		printf("memory check\n");
		one->name = &func;
	} else {
		one->name();
	}
	return one;
}

int main() {
	printf("%i\n", val);
	val = 1;

	printf("%i\n", val);

	Object* one = getObject();
	printf("%p\n", one);

	one = getObject();
	printf("%p\n", one);
}
