class Log:
    def log(obj, filename = "Log.txt"):
        print(obj, file=open(filename, "a"))
