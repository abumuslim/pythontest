# Create your views here.

from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.utils import simplejson
from testApp.backend import backend_compile
from testApp.backend import backend_getProjectTree
from testApp.backend import retrieveFile
from testApp.backend import backend_saveFile
from testApp.backend import backend_compileAndLoad
from testApp.backend import backend_runRemoteServer
from testApp.backend import backend_deleteFile


def home(request):
    return render_to_response('home.html', context_instance=RequestContext(request))


def compile(request):
    code = request.REQUEST.get('code', None)

    #print code
    compilationResults = backend_compile( code )

    # Create response dictionary
    response_dict = {}
    response_dict['result'] = compilationResults['result']
    response_dict['success'] = compilationResults['success']

    return HttpResponse(simplejson.dumps(response_dict), mimetype='application/json')


def about(request):
    return render_to_response('about.html', context_instance=RequestContext(request))

def ide(request):
    return render_to_response('ide.html', context_instance=RequestContext(request))

def loadTProjectree(request):
    projectPath = request.REQUEST.get('projectPath', None)
    projectName = request.REQUEST.get('projectName', None)

    htmlCode = backend_getProjectTree(projectPath, projectName)
    response_dict = {}
    response_dict['htmlCode'] = htmlCode
    return HttpResponse(simplejson.dumps(response_dict), mimetype='application/json')

def openFile(request):
    filePath = request.REQUEST.get('filePath', None)
    filePath = filePath.strip()

    file = retrieveFile(filePath)
    #file = readFile(filePath)
    response_dict = {}
    response_dict['file'] = file
    return HttpResponse(simplejson.dumps(response_dict), mimetype='application/json')

def saveFile(request):
    filePath = request.REQUEST.get('filePath', None)
    fileData = request.REQUEST.get('fileData', None)
    filePath = filePath.strip()

    backend_saveFile(filePath, fileData)

    response_dict = {}
    return HttpResponse(simplejson.dumps(response_dict), mimetype='application/json')

def compileAndLoad(request):
    port = request.REQUEST.get('port', None)
    url = backend_compileAndLoad(port)
    response_dict = {}
    response_dict['url'] = url
    return HttpResponse(simplejson.dumps(response_dict), mimetype='application/json')

def runRemoteServer(request):
    port = request.REQUEST.get('port', None)
    backend_runRemoteServer(port)
    response_dict = {}
    return HttpResponse(simplejson.dumps(response_dict), mimetype='application/json')

def testColorbox(request):
    return render_to_response('testColorbox.html', context_instance=RequestContext(request))

def deleteFile(request):
    filePath = request.REQUEST.get('filePath', None)
    backend_deleteFile(filePath)
    response_dict = {}
    return HttpResponse(simplejson.dumps(response_dict), mimetype='application/json')
